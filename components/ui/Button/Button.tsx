import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import styles from "./styles/button.module.css";

type ButtonVariant = "outline" | "solid" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

type ButtonClassProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  stacked?: boolean;
  fullWidth?: boolean;
  rounded?: "pill" | "md";
  className?: string;
};

type SharedButtonProps = ButtonClassProps & {
  children: ReactNode;
};

type ButtonAsLinkProps = SharedButtonProps & {
  href: string;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">;

type ButtonAsAnchorProps = SharedButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonAsButtonProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type ButtonProps =
  | ButtonAsButtonProps
  | ButtonAsLinkProps
  | ButtonAsAnchorProps;

function isExternalHref(href: string) {
  return (
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith("http://") ||
    href.startsWith("https://")
  );
}

function isFileDownload(
  href: string,
  download?: string | boolean,
): download is string | true {
  return Boolean(download) || /\.(pdf|zip|docx?|xlsx?|pptx?)$/i.test(href);
}

function getClassName({
  variant = "outline",
  size = "md",
  active = false,
  stacked = false,
  fullWidth = false,
  rounded = "pill",
  className,
}: ButtonClassProps) {
  return [
    styles.button,
    styles[variant],
    !stacked && styles[size],
    stacked && styles.stacked,
    active && styles.active,
    fullWidth && styles.fullWidth,
    rounded === "md" && styles.roundedMd,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Button(props: ButtonProps) {
  const {
    variant = "outline",
    size = "md",
    active = false,
    stacked = false,
    fullWidth = false,
    rounded = "pill",
    className,
    children,
    href,
    ...rest
  } = props;

  const classes = getClassName({
    variant,
    size,
    active,
    stacked,
    fullWidth,
    rounded,
    className,
  });

  if (href) {
    const download =
      "download" in rest
        ? (rest as AnchorHTMLAttributes<HTMLAnchorElement>).download
        : undefined;

    if (isExternalHref(href) || isFileDownload(href, download)) {
      const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      );
    }

    const linkProps = rest as Omit<
      React.ComponentProps<typeof Link>,
      "href" | "className" | "children"
    >;

    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
