import { App_color } from '@/utils/constant';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SearchInput from '../share/Inputs/SearchInput';

const Header = () => {
  const [search, setSearch] = React.useState('');
  return (
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Shop</Text>
            {/* 2. Input tìm kiếm */}
            <View style={styles.searchContainer}>
              <SearchInput 
                value={search}
                onChangeText={setSearch}
                showFilter={false}
                placeholder="Search ..."
                containerStyle={{ width: '100%' }} 
              />
            </View>
          </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: App_color.background,
  },
  headerContainer: {
    flexDirection: 'row',      
    alignItems: 'center',      
    paddingHorizontal: 16,     
    paddingVertical: 10,       
    gap: 12,                   
    backgroundColor: App_color.backgroundLight, 
  },

  headerTitle: {
    fontSize: 26, 
    fontFamily: 'Raleway-Bold',
    color: App_color.textPrimary,
  },

  searchContainer: {
    flex: 1, 
    justifyContent: 'center', 
  }
});


export default Header;