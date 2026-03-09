Full admin spec is ready. Here's what's covered:

**8 admin pages** under the `/admin` prefix — Login, Dashboard, Products list, Add/Edit product, Categories, Orders log, and Settings.

A few things worth flagging:

**The Edit Product form is the most detailed page** — it covers every field from the storefront spec: name, slug (auto-generated, editable, unique-validated), short/full description, images with drag-to-reorder, price, unit, variants, nutrition/specs table, stock count, certifications, NAFDAC number, featured/bestseller/new toggles, and SEO meta fields.

**The WhatsApp Config section in Settings** is important — the business phone number and the auto-generated message template are both editable from there, so the client doesn't need a developer to update them.

**The Orders Log page** is optional but practical — since WhatsApp orders don't auto-capture anywhere, having a place to manually log "received order from X, status: Dispatched" gives the business a paper trail without needing a full order management system.

**The last table** ("How Admin Changes Reflect on the Storefront") is especially useful for your agent — it maps every admin action to its exact storefront effect, so there's no ambiguity about what should be reactive and what should be immediate.
