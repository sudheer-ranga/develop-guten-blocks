import React, { lazy, Suspense } from 'react';
// Import SVG as React component using @svgr/webpack.
// https://www.npmjs.com/package/@svgr/webpack

import save from './save/save';
import { ReactComponent as Logo } from '../../svgs/bv-logo.svg';
const { __ } = wp.i18n;

const Edit = lazy(() => import('./edit/edit'));

export const name = 'dgb/static';
export const settings = {
  title: __('Static Test', 'dgb'),
  icon: { src: Logo },
  category: 'dgb',
  attributes: {
    content: {
      type: 'array',
      source: 'children',
      selector: 'h2'
    }
  },
  edit: props => {
    return (
      <Suspense fallback={<div>Loading..</div>}>
        <Edit {...props} />
      </Suspense>
    );
  },
  save: save
};
