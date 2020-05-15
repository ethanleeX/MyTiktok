import React, {useState, useCallback, useEffect} from 'react';
import {FlatList, Dimensions} from 'react-native';
import ShortVideoItem from './ShortVideoItem';

const HEIGHT = Dimensions.get('window').height;

interface ItemData {
  pause: boolean;
  id: number;
}

const ShortVideoPage = () => {
  const [currentItem, setCurrentItem] = useState(0);
  const [data, setData] = useState<ItemData[]>([]);

  const _onViewableItemsChanged = useCallback(({viewableItems}) => {
    // 这个方法为了让state对应当前呈现在页面上的item的播放器的state
    // 也就是只会有一个播放器播放，而不会每个item都播放
    // 可以理解为，只要不是当前再页面上的item 它的状态就应该暂停
    // 只有100%呈现再页面上的item（只会有一个）它的播放器是播放状态
    if (viewableItems.length === 1) {
      setCurrentItem(viewableItems[0].index);
    }
  }, []);

  useEffect(() => {
    const mockData = [];
    for (let i = 0; i < 100; i++) {
      mockData.push({id: i, pause: false});
    }
    setData(mockData);
  }, []);

  return (
    <FlatList<ItemData>
      onMoveShouldSetResponder={() => true}
      style={{flex: 1}}
      data={data}
      renderItem={({item, index}) => (
        <ShortVideoItem paused={index !== currentItem} id={item.id} />
      )}
      pagingEnabled={true}
      getItemLayout={(item, index) => {
        return {length: HEIGHT, offset: HEIGHT * index, index};
      }}
      onViewableItemsChanged={_onViewableItemsChanged}
      keyExtractor={(item, index) => index.toString()}
      viewabilityConfig={{
        viewAreaCoveragePercentThreshold: 80, // item滑动80%部分才会到下一个
      }}
    />
  );
};

export default ShortVideoPage;
