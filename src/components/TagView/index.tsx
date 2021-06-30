import React, { useState, useEffect, useRef } from 'react';
import { RouteContext, RouteContextType } from '@ant-design/pro-layout';
import { history } from 'umi';
import Tags from './tags';
import styles from './index.less';

export type TagsItemType = {
  title: string;
  path: string;
  actived: boolean;
  query?: any;
  children: any;
};

console.log('zhixingl');
// antd-design-pro-v5-tabview
/**
 * @component TagView 标签页组件
 */
const TagView: React.FC = ({ children }) => {
  const [tags, setTags] = useState<TagsItemType[]>([]);

  const routeContext = useRef<RouteContextType>();

  useEffect(() => {
    console.log(routeContext);
  }, []);

  useEffect(() => {
    console.log(routeContext);
    if (routeContext?.current) {
      handleOnChange(routeContext.current);
    }
  }, [routeContext?.current]);

  // 初始化 visitedViews，设置project为首页
  const initTags = (routeContext: RouteContextType) => {
    if (tags.length === 0 && routeContext.menuData) {
      const firstTag = routeContext.menuData.filter((el) => el.path === '/welcome')[0];
      setTags([
        {
          title: firstTag.name + '',
          path: firstTag.path + '',
          actived: true,
          children,
        },
      ]);
      history.push({ pathname: firstTag.path, query: firstTag.query });
    }
  };

  // 关闭标签
  const handleCloseTag = (tag: TagsItemType) => {
    let tagsCopy: TagsItemType[] = tags.map((el) => ({ ...el }));
    // 判断是否已打开过该页面
    tagsCopy.forEach((item, i) => {
      if (item.path === tag?.path) {
        tagsCopy[i - 1].actived = true;
      } else {
        item.actived = false;
      }
    });
    setTags(tagsCopy.filter((el) => el.path !== tag?.path));
  };

  // 监听路由改变
  const handleOnChange = (routeContext: RouteContextType) => {
    if (tags.length === 0) {
      return initTags(routeContext);
    }

    const { currentMenu } = routeContext;
    let tagsCopy: TagsItemType[] = tags.map((el) => ({ ...el }));
    let hasTag = false;

    // 判断是否已打开过该页面
    tagsCopy.forEach((item) => {
      if (currentMenu?.path === item.path) {
        item.actived = true;
        hasTag = true;
      } else {
        item.actived = false;
      }
    });

    // 没有该tag时追加一个
    if (!hasTag) {
      tagsCopy.push({
        title: routeContext?.title + '',
        path: currentMenu?.path + '',
        actived: true,
        children,
      });
    }

    setTags(tagsCopy);
  };

  return (
    <>
      <RouteContext.Consumer>
        {(value: RouteContextType) => {
          // console.log(value);
          routeContext.current = value;
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
