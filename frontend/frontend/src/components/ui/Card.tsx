import type { ReactNode } from "react";
import clsx from "clsx";


interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?:()=>void;
}

export const Card = ({ children,onClick, className = "" }: CardProps) => {
  return (
    <div
        onClick={onClick}
      className={clsx(
        "bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 ease-in-out shadow-sm p-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("flex flex-col space-y-1.5 p-4", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={clsx("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("p-4 pt-0", className)} {...props} />
  );
}
