import React, { useState, useEffect, useRef } from 'react';
import { RouteContext } from '@ant-design/pro-layout';
import type { RouteContextType } from '@ant-design/pro-layout';
import { history } from 'umi';
import Tags from './Tags';
import styles from './index.less';

export type TagsItemType = {
  title?: string;
  path?: string;
  actived: boolean;
  query?: any;
  children: any;
};

interface IProps {
  home: string;
}

/**
 * @component TagView 标签页组件
 */
const TagView: React.FC<IProps> = ({ children, home }) => {
  const [tagList, setTagList] = useState<TagsItemType[]>([]);
  const [refresh, setRefresh] = useState(false);

  const routeContextRef = useRef<RouteContextType>();

  useEffect(() => {
    if (routeContextRef?.current) {
      handleOnChange(routeContextRef.current);
    }
  }, [routeContextRef?.current]);

  // 初始化 visitedViews，设置project为首页
  const initTags = (routeContext: RouteContextType) => {
    if (tagList.length === 0 && routeContext.menuData) {
      const firstTag = routeContext.menuData.filter((el) => el.path === home)[0];
      const title = firstTag.name;
      const path = firstTag.path;
      setTagList([
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

  // 监听路由改变
  const handleOnChange = (routeContext: RouteContextType) => {
    const { currentMenu } = routeContext;

    // tags初始化
    if (tagList.length === 0) {
      return initTags(routeContext);
    }

    // 判断是否已打开过该页面
    let hasOpen = false;
    const tagsCopy: TagsItemType[] = tagList.map((item) => {
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
    return setTagList(tagsCopy);
  };

  // 关闭标签
  const handleCloseTag = (tag: TagsItemType) => {
    // 判断关闭标签是否处于打开状态
    const tagsCopy: TagsItemType[] = tagList
      .map((el, i) => {
        if (el.path === tag.path) {
          const path = tagList[i - 1].path || '';
          history.push(path);
        }
        return { ...el };
      })
      .filter((el) => el.path !== tag?.path);

    setTagList(tagsCopy);
  };

  // 关闭所有标签
  const handleCloseAll = () => {
    const tagsCopy: TagsItemType[] = tagList.filter((el) => el.path === home);
    history.push(home);
    setTagList(tagsCopy);
  };

  // 关闭其他标签
  const handleCloseOther = (tag: TagsItemType) => {
    const tagsCopy: TagsItemType[] = tagList.filter(
      (el) => el.path === home || el.path === tag.path,
    );
    history.push({ pathname: tag?.path, query: tag?.query });
    setTagList(tagsCopy);
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
        <div className={styles.tags_container}>
          <Tags
            tagList={tagList}
            handleCloseTag={handleCloseTag}
            handleCloseAll={handleCloseAll}
            handleCloseOther={handleCloseOther}
          />
        </div>
      </div>
      {tagList.map((item) => {
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
