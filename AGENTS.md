<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the TanStack file-based routes and shared header/footer in the root shell; distinct content pages need distinct URLs and metadata.
- Centralize the visual system in src/styles.css and use semantic Button variants; this keeps the static showcase consistent across devices.
- Product listings are read from the database through server functions, never written into markup, so the owner can add, hide or reorder products without a code change.
- The contact composer only copies text to the clipboard and never sends or stores messages; the published contact address lives in one shared module so it stays consistent everywhere.
- Pre-optimize shared UI dependencies with React in Vite; discovering them after first render can mix cached React optimizer generations during preview updates.
