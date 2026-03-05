import React from "react";

type PageContainerProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export default function PageContainer({
  children,
  title,
  description,
}: PageContainerProps) {
  return (
    <div className="w-full h-full p-6">

      {/* Header da página */}
      {(title || description) && (
        <div className="mb-6">

          {title && (
            <h1 className="text-2xl font-semibold text-white">
              {title}
            </h1>
          )}

          {description && (
            <p className="text-sm text-white/50 mt-1">
              {description}
            </p>
          )}

        </div>
      )}

      {/* Conteúdo */}
      <div className="space-y-6">
        {children}
      </div>

    </div>
  );
}