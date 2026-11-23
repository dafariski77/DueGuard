import React from 'react';

const createComponent = (name) => {
  const Component = React.forwardRef((props, ref) => {
    return React.createElement(name, { ...props, ref }, props.children);
  });
  Component.displayName = name;
  return Component;
};

export const View = createComponent('View');
export const Text = createComponent('Text');
export const Pressable = createComponent('Pressable');
export const TouchableOpacity = createComponent('TouchableOpacity');
export const ScrollView = createComponent('ScrollView');
export const SafeAreaView = createComponent('SafeAreaView');
export const TextInput = createComponent('TextInput');
export const Switch = createComponent('Switch');
export const Modal = createComponent('Modal');
export const Image = createComponent('Image');
export const ActivityIndicator = createComponent('ActivityIndicator');
export const FlatList = createComponent('FlatList');

export const StyleSheet = {
  create: (styles) => styles,
  flatten: (styles) =>
    Array.isArray(styles)
      ? Object.assign({}, ...styles.filter(Boolean))
      : styles || {},
};

export const Platform = {
  OS: 'ios',
  select: (obj) => obj.ios ?? obj.default,
};

export default {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Switch,
  Modal,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Platform,
};
