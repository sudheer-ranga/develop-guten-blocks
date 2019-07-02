const { RichText } = wp.editor;
const { __ } = wp.i18n;

import './edit.scss';

import React, { Component } from 'react';
import './edit.scss';

export default class Edit extends Component {
  constructor(props) {
    super(props);
  }

  onChangeContent(content) {
    this.props.setAttributes({ content });
  }

  render() {
    const { attributes, className } = this.props;

    return (
      <RichText
        tagname="h2"
        className={className}
        placeholder={__('Add your content...', 'dgb')}
        value={attributes.content}
        onChange={content => {
          this.onChangeContent(content);
        }}
      />
    );
  }
}
