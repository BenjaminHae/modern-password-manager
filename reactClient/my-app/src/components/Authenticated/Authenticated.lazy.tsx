import React, { lazy, Suspense } from 'react';
import { IAuthenticatedProps } from '../commonProps';

const LazyAuthenticated = lazy(() => import('./Authenticated'));

const Authenticated = (props: IAuthenticatedProps & JSX.IntrinsicAttributes & { children?: React.ReactNode; }): JSX.Element => (
  <Suspense fallback={null}>
    <LazyAuthenticated {...props} />
  </Suspense>
);

export default Authenticated;
