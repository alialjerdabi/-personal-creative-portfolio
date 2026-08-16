import type { FaqEntry } from "@/data/pages";

/**
 * Frequently asked questions, on native `<details>`.
 *
 * NOT a hand-rolled accordion. `<details>`/`<summary>` already gives the
 * open/close state, the keyboard handling, the screen-reader semantics
 * and the ability to be found by in-page search — all of which a div with
 * an onClick has to re-implement and usually re-implements incompletely.
 *
 * It also matters for the job this component exists to do: the answers
 * are in the DOM whether or not they are open, so a crawler and an
 * answer engine read all of them. An accordion that mounts its answer on
 * click is invisible to both.
 *
 * A server component. There is nothing here for JavaScript to own.
 */
export default function FaqList({
  items,
  id,
}: {
  items: FaqEntry[];
  id?: string;
}) {
  return (
    <div id={id} className="lab-faq">
      {items.map((item) => (
        <details key={item.q} className="lab-faq__item" name="faq">
          <summary className="lab-faq__q">
            <span>{item.q}</span>
            <span aria-hidden="true" className="lab-faq__sign" />
          </summary>
          <div className="lab-faq__a">
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
