import React from "react";
import clsx from "clsx";

type GridViewProps = {
  mode: "monthly" | "weekly" | "daily";
  children: React.ReactNode;
};

const GridView = ({ mode, children }: GridViewProps) => {
  const className = clsx(
    "grid grid-cols-7 gap-4 p-4",
    {
      monthly: "grid-rows-5",
      weekly: "grid-rows-1",
      daily: "grid-rows-1",
    }
  );

  return <div className={clsx(className, "grid-view", mode)}>{children}</div>;
};

export default GridView;
