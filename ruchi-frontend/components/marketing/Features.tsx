const FEATURES = [
  {
    icon: "🎯",
    title: "Smart matching",
    desc: "Answer a few questions about what you're into and get matched with people who share it — ranked by how closely your interests align.",
  },
  {
    icon: "🔒",
    title: "Anonymous, verified",
    desc: "You're confirmed as a real student at your institution, but you show up to others only as a pseudonym. Your identity stays yours.",
  },
  {
    icon: "🌐",
    title: "Communities, not just DMs",
    desc: "Join interest-based groups for your campus — talk anime, gaming, fitness, or startups with people down the hall.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-ruchi-navy text-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16">
          Why Ruchi
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <div className="text-4xl mb-5">{f.icon}</div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-white/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
