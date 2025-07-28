import React, { useRef, useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, ViewToken, Dimensions } from 'react-native';

interface ScrollPickerProps<T> {
  data: T[];
  itemHeight?: number;
  visibleItems?: number;
  renderItemText?: (item: T) => string;
  onValueChange?: (value: T) => void;
}

const { height: screenHeight } = Dimensions.get('window'); //use later maybe

export function ScrollPicker<T>({
  data,
  itemHeight = 40,
  visibleItems = 5,
  renderItemText,
  onValueChange,
}: ScrollPickerProps<T>) {
  const listRef = useRef<FlatList>(null);
  const [selectedIndex, setSelectedIndex] = useState(Math.floor(data.length / 2));

  useEffect(() => {
  if (listRef.current) {
    listRef.current.scrollToOffset({
      offset: selectedIndex * itemHeight,
      animated: false, 
    });
    onValueChange?.(data[selectedIndex]);
  }
}, []);

  const spacerHeight = (itemHeight * (visibleItems - 1)) / 2;

  const handleScrollEnd = (e: any) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight);

    setSelectedIndex(index);
    onValueChange?.(data[index]);

    listRef.current?.scrollToOffset({
      offset: index * itemHeight,
      animated: true,
    });
  };

  const renderItem = ({ item, index }: { item: T; index: number }) => {
    const isSelected = index === selectedIndex;

    return (
      <View style={[styles.itemContainer, { height: itemHeight }]}>
        <Text style={[styles.itemText, isSelected && styles.selectedText]}>
          {renderItemText? renderItemText(item) : String(item)}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ height: itemHeight * visibleItems }}>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={renderItem}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        contentContainerStyle={{
          paddingVertical: spacerHeight,
        }}
      />

      <View
        pointerEvents='none'
        style={[
          styles.highlight,
          {
            top: spacerHeight,
            height: itemHeight,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c7a84c',
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  itemText: {
    color: '#888',
    fontSize: 18,
  },
  selectedText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  },
  highlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#aaa',
  },
});
