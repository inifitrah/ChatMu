import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BackButton from "@/components/auth/BackButton";
import Header from "./Header";

interface CardWrapperProps {
  headerTitle: string;
  headerSubtitle: string;
  headerSubtitle2: string;
  backButtonHref: string;
  children?: React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = ({
  children,
  headerTitle,
  headerSubtitle,
  headerSubtitle2,
  backButtonHref,
}) => {
  return (
    <Card>
      <CardHeader>
        <Header
          title={headerTitle}
          subtitle={headerSubtitle}
          subtitle2={headerSubtitle2}
          backButtonHref={backButtonHref}
        />
      </CardHeader>
      <CardContent className="mt-2">{children}</CardContent>
    </Card>
  );
};

export default CardWrapper;
