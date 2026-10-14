# Makskar Profit Check / Kâr Kontrolü

Independent campaign comparison prototype. No source or customer data from the private Makskar application is included.

## Run
Serve `dist/` using any static HTTP server. No dependency installation or build needed.

## Tests
`node --test tests/engine.test.mjs`

## Accounting model
Sales price and customer shipping charge are gross, using the product VAT rate. Purchase, seller shipping and other costs can be entered gross or net; separate VAT rates are available. Expense VAT is assumed fully recoverable. Commission may be quoted inclusive or exclusive of its own VAT, based on gross or net sales, optionally including customer shipping. Profit is before income/corporate taxes. No withholding cash-flow modelling or automatic marketplace tariffs.

The two-item bundle contains two identical items. Other costs and shipping apply once per order. Break-even is the total gross product price after discount, holding shipping income and costs fixed. No finite break-even is displayed when the revenue coefficient is non-positive. Margin uses net revenue including net customer shipping. Monetary outputs round only for display; the initial engine uses JavaScript floating point.

## Independent reference example
Gross sale 360, customer delivery 30, cost 120, seller shipping 60, other 12; all VAT 20%. Commission 10% of gross product sales, excluding commission VAT. Net revenue = 325. Net costs = 100 + 50 + 10 + 36. Profit = 129. Discount 10%: 102.60 profit. Two items with 5% discount and gross shipping 72: order profit 256.60, item profit 128.30. Free delivery: 104 profit.

## Hackathon status
This is a first working prototype, not a completed submission. Public GitHub repository, TestSprite 3.0 suite, GitHub App checks on a PR, public deployment and submission evidence remain to be completed. Node tests are not TestSprite tests. Browser QA has not yet been performed.

## Privacy
Inputs stay in memory in the browser. No storage, analytics, API connections, customer records, authentication or payments in the application. Hosting access control is separate.
