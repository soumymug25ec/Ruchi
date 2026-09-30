const { io } = require("socket.io-client");
const API = "http://localhost:5000/api";
const stamp = Date.now();
async function call(method, path, token, body) {
  const r = await fetch(API + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: r.status, data: await r.json() };
}
const ok = (label, cond, extra = "") => console.log(`${cond ? "PASS" : "FAIL"}  ${label} ${extra}`);

(async () => {
  const pw = "testpass123";
  const e1 = `e2e1_${stamp}@kiit.ac.in`, e2 = `e2e2_${stamp}@kiit.ac.in`;

  let s1 = await call("POST", "/auth/signup", null, { email: e1, password: pw });
  let s2 = await call("POST", "/auth/signup", null, { email: e2, password: pw });
  ok("signup returns email_verified=true (frontend skips verify page)", s1.data.email_verified === true);

  const l1 = await call("POST", "/auth/login", null, { email: e1, password: pw });
  const l2 = await call("POST", "/auth/login", null, { email: e2, password: pw });
  const t1 = l1.data.token, t2 = l2.data.token, u1 = l1.data.user.id, u2 = l2.data.user.id;
  ok("login returns token + user", !!t1 && !!t2);

  const me = await call("GET", "/users/me", t1);
  ok("profile has institution_id + pseudonym (AuthGuard)", !!me.data.institution_id && !!me.data.pseudonym, me.data.pseudonym);

  const noQ = await call("POST", "/interests/start-profiling", t1, { category_id: 3 });
  ok("category without questions -> 404 (frontend skips it)", noQ.status === 404);

  for (const [tok, answers] of [[t1, ["action","one_piece","subbed"]], [t2, ["action","aot","subbed"]]]) {
    const st = await call("POST", "/interests/start-profiling", tok, { category_id: 1 });
    let q = st.data.current_question, next;
    for (const a of answers) {
      next = await call("POST", "/interests/submit-answer", tok, { category_id: 1, question_id: q.id, answer_value: a });
      q = next.data.next_question;
    }
    await call("POST", "/interests/complete", tok, { category_id: 1, final_answer: "" });
  }
  const ints = await call("GET", "/interests/user-interests", t1);
  ok("profile page: interests saved", ints.data.interests.length === 1, ints.data.interests[0]?.category_name);

  const recs = await call("GET", "/matches/recommendations?limit=6&offset=0", t1);
  ok("dashboard: recommendations include user2", recs.data.recommendations.some(r => r.user_id === u2), `(${recs.data.total_matches} total)`);

  // live chat: user2 listens on a socket, user1 sends via REST like the UI does
  const got = new Promise((res) => {
    const sock = io("http://localhost:5000", { auth: { token: t2 } });
    sock.on("connect", async () => {
      await call("POST", "/chat/messages", t1, { receiver_id: u2, content: "hello from the UI flow" });
    });
    sock.on("message:received", (m) => { sock.disconnect(); res(m); });
    setTimeout(() => res(null), 4000);
  });
  const live = await got;
  ok("chat: recipient receives live socket message", live && live.sender_id === u1 && live.sender_id !== u2);

  const convs = await call("GET", "/chat/conversations", t2);
  const c = convs.data.conversations.find(c => c.other_user_id === u1);
  ok("messages list: conversation with unread count", !!c, `unread_count=${JSON.stringify(c?.unread_count)}`);
  await call("POST", "/chat/mark-read", t2, { other_user_id: u1 });
  const hist = await call("GET", `/chat/messages/${u1}`, t2);
  ok("conversation page: history + other pseudonym", hist.data.messages.length === 1 && !!hist.data.other_user_pseudonym);

  const groups = await call("GET", `/groups?institution_id=${me.data.institution_id}&limit=50`, t1);
  const g = groups.data.groups.find(g => g.category === "Anime & Manga");
  ok("communities: groups listed for institution", groups.data.groups.length === 11);
  const blocked = await call("POST", `/groups/${g.id}/messages`, t1, { content: "x" });
  ok("posting before joining is blocked (403)", blocked.status === 403);
  await call("POST", `/groups/${g.id}/join`, t1);
  const post = await call("POST", `/groups/${g.id}/messages`, t1, { content: "first post from e2e" });
  ok("join then post works", post.status === 201);
  const gd = await call("GET", `/groups/${g.id}`, t1);
  ok("group detail: is_member true, count updated", gd.data.is_member === true && gd.data.member_count >= 1);
  const gm = await call("GET", `/groups/${g.id}/messages`, t1);
  ok("group feed returns the post w/ pseudonym", gm.data.messages.some(m => m.content === "first post from e2e" && m.sender_pseudonym));
})();
