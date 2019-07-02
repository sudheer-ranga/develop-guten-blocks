const { RichText } = wp.editor;

import './save.scss';

const save = props => {
  const { attributes, className } = props;

  return (
    <RichText.Content
      tagName="h2"
      className={className}
      value={attributes.content}
    />
  );
};

export default save;
