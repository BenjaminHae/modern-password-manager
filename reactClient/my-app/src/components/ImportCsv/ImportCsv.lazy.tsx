import React, { lazy, Suspense } from 'react';
import { ImportCsvProps } from '../commonProps';

const LazyImportCsv = lazy(() => import('./ImportCsv'));

const ImportCsv = (props: ImportCsvProps & JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyImportCsv {...props} />
  </Suspense>
);

export default ImportCsv;
