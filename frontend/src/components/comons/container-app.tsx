interface ContainerAppProps {
  title: string;
  description?: string;
  mainAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl"; // nếu không truyền -> full width
}

export default function ContainerApp(props: ContainerAppProps) {
  const {
    title,
    description,
    mainAction,
    secondaryAction,
    children,
    size = "xl",
  } = props;
  const widthClass =
    size === "sm"
      ? "container mx-auto max-w-screen-sm"
      : size === "md"
      ? "container mx-auto max-w-screen-md"
      : size === "lg"
      ? "container mx-auto max-w-screen-lg"
      : size === "xl"
      ? "container mx-auto max-w-screen-xl"
      : size === "2xl"
      ? "container mx-auto max-w-screen-2xl"
      : ""; // full width mặc định
  return (
    <div className={`flex flex-col gap-4 p-8 pt-5 ${widthClass}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex justify-between items-center gap-2">
          {mainAction}
          {secondaryAction}
        </div>
      </div>
      <>{children}</>
    </div>
  );
}
