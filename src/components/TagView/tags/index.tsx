import React from 'react';
import { history } from 'umi';
import type { TagsItemType } from '../index';

import styles from './index.less';

interface IProps {
  tags: TagsItemType[];
  handleCloseTag: (tag: TagsItemType) => void;
}

const TagsView: React.FC<IProps> = ({ tags, handleCloseTag }) => {
  return (
    <div className={styles.tags_view_container}>
      <div className={styles.tags_view_wrapper}>
        <div
          style={{
            width: '100%',
            height: 34,
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            overflowY: 'hidden',
          }}
        >
          {tags.map((item, i) => (
            <a
              key={item.path}
              className={
                item.actived ? `${styles.tags_view_item} ${styles.active}` : styles.tags_view_item
              }
              onClick={() => {
                history.push({ pathname: item.path, query: item.query });
              }}
            >
              {item.title}
              {i !== 0 && (
                <span
                  className={styles.el_icon_close}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTag(item);
                  }}
                >
                  ×
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsView;
