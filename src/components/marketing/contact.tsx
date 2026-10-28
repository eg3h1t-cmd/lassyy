export function Contact() {
  return (
    <section id="contact" className="border-t border-zinc-200 py-20 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight">Contact</h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Questions about deployment, security, or integrations? Reach out and we will help you plan the next step.
        </p>
        <a
          href="mailto:hello@example.com"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Email us
        </a>
      </div>
    </section>
  );
}