import React, { lazy, Suspense } from 'react';
import { WebAuthnLocalProps } from '../commonProps';

const LazyWebAuthnLocal = lazy(() => import('./WebAuthnLocal'));

const WebAuthnLocal = (props: WebAuthnLocalProps & JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyWebAuthnLocal {...props} />
  </Suspense>
);

export default WebAuthnLocal;
