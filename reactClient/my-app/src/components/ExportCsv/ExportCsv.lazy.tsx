import React, { lazy, Suspense } from 'react';
import { IExportCsvProps } from '../commonProps';

const LazyExportCsv = lazy(() => import('./ExportCsv'));

const ExportCsv = (props: IExportCsvProps & JSX.IntrinsicAttributes & { children?: React.ReactNode; }): JSX.Element => (
  <Suspense fallback={null}>
    <LazyExportCsv {...props} />
  </Suspense>
);

export default ExportCsv;
