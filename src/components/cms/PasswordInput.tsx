"use client";

import { InputHTMLAttributes, useState } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function PasswordInput(props: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="cmsPassword">
      <input {...props} type={visible ? "text" : "password"} />
      <button
        type="button"
        className="cmsPasswordToggle"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </span>
  );
}
