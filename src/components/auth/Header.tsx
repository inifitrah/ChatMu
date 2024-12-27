import React from "react";
import BackButton from "@/components/BackButton";

interface HeaderProps {
  backButtonHref: string;
  title: string;
  subtitle: string;
  subtitle2?: string;
}

const Header = ({
  backButtonHref,
  title,
  subtitle,
  subtitle2,
}: HeaderProps) => {
  return (
    <>
      <BackButton href={backButtonHref} />
      <div className="pt-5 space-y-3">
        <h1 className="text-4xl font-semibold">{title}</h1>
        <h2 className="text-3xl font-normal">{subtitle}</h2>
        {subtitle2 && <h2 className="text-3xl font-normal">{subtitle2}</h2>}
      </div>
    </>
  );
};

export default Header;
