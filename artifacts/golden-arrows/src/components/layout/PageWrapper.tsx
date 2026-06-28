import { AdColumn } from "@/components/AdBanner";

interface PageWrapperProps {
  children: React.ReactNode;
  page: string;
  className?: string;
  py?: string;
  noAds?: boolean;
}

export function PageWrapper({
  children,
  page,
  className = "",
  py = "py-5 sm:py-8",
  noAds = false,
}: PageWrapperProps) {
  if (noAds) {
    return (
      <div className={`max-w-[1330px] mx-auto px-4 ${py} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`max-w-[1330px] mx-auto px-4 ${py} ${className}`}>
      <div className="flex gap-5 items-start">
        <div className="hidden xl:block w-36 flex-shrink-0">
          <AdColumn page={page} side="left" />
        </div>
        <div className="flex-1 min-w-0">{children}</div>
        <div className="hidden xl:block w-36 flex-shrink-0">
          <AdColumn page={page} side="right" />
        </div>
      </div>
    </div>
  );
}
