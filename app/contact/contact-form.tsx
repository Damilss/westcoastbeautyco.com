"use client";

import { useActionState } from "react";
import { INITIAL_CONTACT_FORM_STATE, submitContactForm } from "./actions";
import styles from "./page.module.css";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    INITIAL_CONTACT_FORM_STATE,
  );

  return (
    <form className={styles.form} action={formAction}>
      <div className={styles.formRow}>
        <label htmlFor="contact-name" className={styles.srOnly}>
          Name
        </label>
        <input id="contact-name" name="name" type="text" placeholder="Name" />

        <label htmlFor="contact-email" className={styles.srOnly}>
          Email
        </label>
        <input id="contact-email" name="email" type="email" placeholder="Email *" required />
      </div>

      <label htmlFor="contact-phone" className={styles.srOnly}>
        Phone number
      </label>
      <input id="contact-phone" name="phone" type="tel" placeholder="Phone number" />

      <label htmlFor="contact-comment" className={styles.srOnly}>
        Comment
      </label>
      <textarea id="contact-comment" name="comment" placeholder="Comment" rows={7} />

      <button type="submit" className={styles.submitButton} disabled={isPending}>
        {isPending ? "Sending..." : "Send"}
      </button>

      {state.status !== "idle" ? (
        <p
          className={state.status === "success" ? styles.feedbackSuccess : styles.feedbackError}
          role={state.status === "success" ? "status" : "alert"}
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
