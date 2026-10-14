# TestSprite 3.0 acceptance plan

Status: authored acceptance criteria, NOT generated or executed TestSprite tests.

## Product brief
A bilingual browser-only calculator for sellers comparing standard sales, discounts, two-item bundles and free delivery. No sign-up, payment or marketplace API. Inputs are illustrative, not real customer data.

## Environment and integration gate
- Create the separate public GitHub repository `makskar-profit-check`.
- Import this project's source only; never import private Makskar code, database or credentials.
- Deploy a reachable version corresponding to the tested PR commit.
- Current owner-private Sites URL cannot be assumed reachable by TestSprite's cloud.
- Create a TestSprite 3.0 project and suite using this brief and the deployed URL.
- Install the TestSprite GitHub App with access ONLY to the new repository.
- Configure a PR/deployment trigger targeting the matching deployment, not an unrelated old live version.
- Keep one PR open for genuine fixes and resulting successful checks.
- Do not equate GitHub calculation-test results with TestSprite E2E results.

## Reference input
Load example. Price 360, per-item cost 120, shipping 60, customer shipping 30, other costs 12, commission 10%, single discount 10%, bundle discount 5%, bundle shipping 72. Cost inputs include VAT; all VAT rates 20%. Commission quote excludes its VAT, basis gross product sales, customer shipping excluded.

## Acceptance cases
| ID | Action | Expected |
|---|---|---|
| UI01 | Load example in Turkish | Four cards; order profit 129.00, 102.60, 256.60, 104.00 TRY |
| UI02 | Inspect bundle | Per-item profit 128.30; standard sale wins per-item at 129.00 |
| UI03 | Inspect standard | Net revenue 325.00; goods 100, commission 36, shipping 50, other 10; margin 39.69%; break-even product total 184.09 |
| UI04 | Switch EN then TR | Labels translate; numeric inputs and calculated values preserved |
| UI05 | Change price without submitting | Changes pending shown; after submit results recompute |
| UI06 | Enter zero sale price, negative cost, commission >100 or empty required value | Submission blocked; no fabricated valid calculation |
| UI07 | Set single discount 100% | Discounted sale profit -135.00; negative result clearly indicated |
| UI08 | Set gross-basis commission 100% | Break-even shown as unattainable, not Infinity or NaN |
| UI09 | Set commission 12% and quote VAT included | Original reference results unchanged |
| UI10 | Select net-sales basis and charge commission on customer shipping | Standard commission 32.50 and profit 132.50 |
| UI11 | Set other costs 24 gross | Each order profit decreases by 10 |
| UI12 | Choose each breakdown scenario | Rows correspond to selected card; bundle shipping 60 net once, other 10 once |
| UI13 | Mobile at 390px and desktop 1440px | No document horizontal overflow; controls, results and labels usable |
| UI14 | Keyboard-only flow | Inputs and selects reachable, visible focus, submit and language control operable |
| UI15 | Reload page | Illustrative defaults restored; no persisted product inputs |

## Evidence log
Record actual suite/run URLs, tested commit SHA, deployment URL, PR check URL, failing case, real fix commit and rerun result here after execution. Never pre-fill success.

## Sources consulted
https://www.testsprite.com/solutions/ci
https://github.com/TestSprite/testsprite-action

The hackathon specifically calls for the GitHub App integration; do not silently substitute an Actions-only setup.
