"use client";

import { ReactNode, createContext, useContext } from "react";

/**
 * Every page's type by slug, so a client loading state can pick the skeleton
 * for the page being opened. Filled from the page list the nav already reads.
 */
const PageTypesContext = createContext<Record<string, string>>({});

export const PageTypesProvider = ({
  types,
  children,
}: {
  types: Record<string, string>;
  children: ReactNode;
}) => (
  <PageTypesContext.Provider value={types}>
    {children}
  </PageTypesContext.Provider>
);

export const usePageTypes = () => useContext(PageTypesContext);
