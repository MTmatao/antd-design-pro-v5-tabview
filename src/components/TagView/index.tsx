import React, { useState, useEffect, useRef } from 'react';
import { RouteContext } from '@ant-design/pro-layout';
import type { RouteContextType } from '@ant-design/pro-layout';
import { history } from 'umi';
import Tags from './tags';
import styles from './index.less';

export type TagsItemType = {
  title?: string;
  path?: string;
  actived: boolean;
  query?: any;
  children: any;
};

/**
 * @component TagView 标签页组件
 */
const TagView: React.FC = ({ children }) => {
  const [tags, setTags] = useState<TagsItemType[]>([]);

  const routeContextRef = useRef<RouteContextType>();

  useEffect(() => {
    if (routeContextRef?.current) {
      handleOnChange(routeContextRef.current);
    }
  }, [routeContextRef?.current]);

  // 初始化 visitedViews，设置project为首页
  const initTags = (routeContext: RouteContextType) => {
    if (tags.length === 0 && routeContext.menuData) {
      const firstTag = routeContext.menuData.filter((el) => el.path === '/welcome')[0];
      const title = firstTag.name;
      const path = firstTag.path;
      setTags([
        {
          title,
          path,
          children,
          actived: true,
        },
      ]);
      history.push({ pathname: firstTag.path, query: firstTag.query });
    }
  };

  // 关闭标签
  const handleCloseTag = (tag: TagsItemType) => {
    // 判断关闭标签是否处于打开状态
    const tagsCopy: TagsItemType[] = tags
      .map((el, i) => {
        if (el.path === tag.path) {
          const path = tags[i - 1].path || '';
          history.push(path);
        }
        return { ...el };
      })
      .filter((el) => el.path !== tag?.path);

    setTags(tagsCopy);
  };

  // 监听路由改变
  const handleOnChange = (routeContext: RouteContextType) => {
    const { currentMenu } = routeContext;

    // tags初始化
    if (tags.length === 0) {
      initTags(routeContext);
      return false;
    }

    // 判断是否已打开过该页面
    let hasOpen = false;
    const tagsCopy: TagsItemType[] = tags.map((item) => {
      if (currentMenu?.path === item.path) {
        hasOpen = true;
        return { ...item, actived: true };
      } else {
        return { ...item, actived: false };
      }
    });

    // 没有该tag时追加一个,并打开这个tag页面
    if (!hasOpen) {
      const title = routeContext.title || '';
      const path = currentMenu?.path;
      tagsCopy.push({
        title,
        path,
        children,
        actived: true,
      });
    }

    setTags(tagsCopy);
    return false;
  };

  return (
    <>
      <RouteContext.Consumer>
        {(value: RouteContextType) => {
          // console.log(value);
          routeContextRef.current = value;
          return null;
        }}
      </RouteContext.Consumer>
      <div className={styles.tag_view}>
        <div className={styles.tabs}>
          <Tags tags={tags} handleCloseTag={handleCloseTag} />
        </div>
      </div>
      {tags.map((item) => {
        return (
          <div key={item.path} style={{ display: item.actived ? 'block' : 'none' }}>
            {item.children}
          </div>
        );
      })}
    </>
  );
};

export default TagView;
