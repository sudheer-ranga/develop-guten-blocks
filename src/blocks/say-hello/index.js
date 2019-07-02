const { __ } = wp.i18n;

// Import SVG as React component using @svgr/webpack.
// https://www.npmjs.com/package/@svgr/webpack
import { ReactComponent as Logo } from '../../svgs/bv-logo.svg';
import React, { lazy, Suspense } from 'react';
import save from './save/save';

const Edit = lazy(() => import('./edit/edit'));

export const name = 'dgb/say-hello';
export const settings = {
  title: __('Say Hello', 'dgb'),
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
