type SupplierRouteHeadingProps = {
  children: string;
};

export function SupplierRouteHeading({ children }: SupplierRouteHeadingProps) {
  return <h1 className="sr-only">{children}</h1>;
}
