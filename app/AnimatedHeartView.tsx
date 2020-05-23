/**
 * 点赞动画
 *
 * @author ethanlee
 */
import React from 'react';
import { Animated, ViewProps } from 'react-native';

export interface AnimatedHeartProps extends ViewProps {
  x: number;
  y: number;
  onAnimFinished: Function;
}

const AnimatedHeartView = React.memo(
  (props: AnimatedHeartProps) => {
    // [-25, 25]随机一个角度
    const rotateAngle = `${Math.round(Math.random() * 50 - 25)}deg`;
    const animValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.sequence([
        Animated.spring(animValue, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 5,
        }),
        Animated.timing(animValue, {
          toValue: 2,
          useNativeDriver: true,
        }),
      ]).start(() => {
        props.onAnimFinished();
      });
    }, [animValue, props]);

    return (
      <Animated.Image
        style={{
          position: 'absolute',
          width: 108,
          height: 126,
          top: props.y - 100,
          left: props.x - 54,
          opacity: animValue.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [1, 1, 0],
          }),
          transform: [
            {
              scale: animValue.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [1.5, 1.0, 2],
              }),
            },
            {
              rotate: rotateAngle,
            },
          ],
        }}
        source={require('./img/heart.webp')}
      />
    );
  },
  () => true,
);

export default AnimatedHeartView;
