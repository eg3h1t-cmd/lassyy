export function Contact() {
  return (
    <section id="contact" className="border-t border-white/[0.06] py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Contact</h2>
        <p className="mx-auto mt-3 max-w-xl text-zinc-400">
          Questions about deployment, security, or integrations? Reach out and we will help you plan the next step.
        </p>
        <a
          href="mailto:hello@example.com"
          className="accent-gradient glow-button mt-6 inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white"
        >
          Email us
        </a>
      </div>
    </section>
  );
}