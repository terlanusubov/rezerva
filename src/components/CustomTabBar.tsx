import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import PlusIcon from '../assets/icons/plus.svg';

const CustomTabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (index === 2) {
          // Plus button
          return (
            <TouchableOpacity
              key={index}
              style={styles.plusButton}
              onPress={() => {
                /* Handle plus button press */
              }}>
              <PlusIcon width={25} height={25} />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabItem}>
            {options.tabBarIcon &&
              options.tabBarIcon({focused: isFocused, color: '', size: 24})}
            <Text style={styles.label}>
              {typeof label === 'string' ? label : ''}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 77,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  curvedBorder: {
    position: 'absolute',
    top: -15,
    left: '50%',
    width: 70,
    height: 30,
    backgroundColor: 'white',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    transform: [{translateX: -35}],
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
    zIndex: 0,
  },

  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#281A4B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0 - 35,
    left: '50%',
    marginLeft: -30,
    zIndex: 1,
  },
  label: {
    fontSize: 10, // Smaller font size to fit
    marginTop: 2,
    height: 14,
    color: '#281A4B',
  },
});

console.log('CustomTabBar.tsx', typeof CustomTabBar);

export default CustomTabBar;
