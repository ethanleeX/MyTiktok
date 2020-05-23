import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ViewProps,
  Image,
  GestureResponderEvent,
} from 'react-native';
import Video from 'react-native-video';
import AnimatedHeartView from './AnimatedHeartView';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;
// 连续点击阈值 连续两次点击间隔小于阈值视为双击
const CLICK_THRESHOLD = 200;

const TEST_VIDEO = 'http://user-platform-oss.kujiale.com/upms/968aa043ab195cb9-1588844483516';

export interface ShortVideoItemProps extends ViewProps {
  paused: boolean;
  id: number;
}

interface HeartData {
  x: number;
  y: number;
  key: string;
}

interface VideoData {
  video: string;
  hasFavor: boolean;
}

const ShortVideoItem = React.memo((props: ShortVideoItemProps) => {
  const [paused, setPaused] = React.useState(props.paused);
  const [data, setData] = React.useState<VideoData>();
  const [heartList, setHeartList] = React.useState<HeartData[]>([]);
  const lastClickTime = React.useRef(0); // 记录上次点击时间
  const pauseHandler = React.useRef<number>();

  useEffect(() => {
    setTimeout(() => {
      setData({
        video: TEST_VIDEO,
        hasFavor: false,
      });
    });
  }, []);

  useEffect(() => {
    setPaused(props.paused);
  }, [props.paused]);

  const _addHeartView = React.useCallback(heartViewData => {
    setHeartList(list => [...list, heartViewData]);
  }, []);

  const _removeHeartView = React.useCallback(index => {
    setHeartList(list => list.filter((item, i) => index !== i));
  }, []);

  const _favor = React.useCallback(
    (hasFavor, canCancelFavor = true) => {
      if (!hasFavor || canCancelFavor) {
        setData(preValue => (preValue ? { ...preValue, hasFavor: !hasFavor } : preValue));
      }
    }, [],
  );

  const _handlerClick = React.useCallback(
    (event: GestureResponderEvent) => {
      const { pageX, pageY } = event.nativeEvent;
      const heartViewData = {
        x: pageX,
        y: pageY - 60,
        key: new Date().getTime().toString(),
      };
      const currentTime = new Date().getTime();
      // 连续点击
      if (currentTime - lastClickTime.current < CLICK_THRESHOLD) {
        pauseHandler.current && clearTimeout(pauseHandler.current);
        _addHeartView(heartViewData);
        if (data && !data.hasFavor) {
          _favor(false, false);
        }
      } else {
        pauseHandler.current = setTimeout(() => {
          setPaused(preValue => !preValue);
        }, CLICK_THRESHOLD);
      }

      lastClickTime.current = currentTime;
    }, [_addHeartView, _favor, data],
  );

  return <View
    onStartShouldSetResponder={() => true}
    onResponderGrant={_handlerClick}
    style={{ height: HEIGHT }}
  >
    {
      data
        ? <Video source={{ uri: data?.video }}
          style={styles.backgroundVideo}
          paused={paused}
          resizeMode={'contain'}
          repeat
        />
        : null
    }
    {
      heartList.map(({ x, y, key }, index) => {
        return (
          <AnimatedHeartView
            x={x}
            y={y}
            key={key}
            onAnimFinished={() => _removeHeartView(index)}
          />
        );
      })
    }
    <View style={{ justifyContent: 'flex-end', paddingHorizontal: 22, flex: 1 }}>
      <View style={{
        backgroundColor: '#000',
        opacity: 0.8,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 'auto',
        paddingHorizontal: 8,
      }}>
        <Text
          style={{ fontSize: 14, color: '#FFF' }}
        >
          短视频招募了
        </Text>
      </View>
      <View
        style={{ height: 1, marginTop: 12, backgroundColor: '#FFF' }}
      />
      <Text
        style={{
          marginTop: 12,
          color: '#FFF',
          fontSize: 16,
          fontWeight: 'bold',
        }}
        numberOfLines={1}
      >
        5㎡长条形卫生间如何设计干湿分离？
      </Text>
      <Text
        style={{
          marginTop: 8,
          color: '#FFF',
          opacity: 0.6,
          fontSize: 12,
        }}
        numberOfLines={2}
      >
        家里只有一个卫生间，一定要这样装！颜值比五星酒店卫生间还高级，卫生间，一定要这样装！颜值比卫生间，一定要这样装！
      </Text>
      <View style={{
        flexDirection: 'row',
        marginTop: 18,
        marginBottom: 20,
        alignItems: 'center',
      }}>
        <View
          style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFF' }}
        />
        <Text style={{ color: '#FFF', fontSize: 14, marginLeft: 4 }}>
          造作设计工作坊
        </Text>
      </View>
    </View>
    <View style={{
      position: 'absolute',
      right: 20,
      bottom: 165,
    }}>
      <Image
        style={styles.icon}
        source={data?.hasFavor ? require('./img/love-f.png') : require('./img/love.png')}
      />
      <Text style={styles.countNumber}>1.2w</Text>
      <Image
        style={styles.icon}
        source={require('./img/collect.png')}
      />
      <Text style={styles.countNumber}>1.2w</Text>
      <Image
        style={styles.icon}
        source={require('./img/comment.png')}
      />
      <Text style={styles.countNumber}>1.2w</Text>
    </View>
    {
      paused
        ? <Image
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 40,
            height: 40,
            marginLeft: -20,
            marginTop: -20,
          }}
          source={require('./img/play.webp')}
        />
        : null
    }
  </View>;
}, (preValue, nextValue) => preValue.id === nextValue.id && preValue.paused === nextValue.paused);

export default ShortVideoItem;

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 'black',
  },
  countNumber: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 4,
  },
  icon: {
    marginTop: 16,
    width: 32,
    height: 32,
  },
});
