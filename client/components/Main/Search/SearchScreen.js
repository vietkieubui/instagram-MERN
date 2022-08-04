import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiUrl, SIZES } from "./../../../assets/constants";
import { Input } from "react-native-elements";
import { debounce } from "lodash";
import axios from "axios";
import SingleUser from "./SingleUser";

export default function SearchScreen(props) {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    handleSearch(searchText);
  }, [searchText]);

  let body = null;
  if (users.length === 0 && searchText === "") {
    body = null;
  } else if (users.length === 0 && searchText !== "") {
    body = null;
  } else {
    body = (
      <View>
        <ScrollView>
          {users.map((user) => (
            <SingleUser
              user={user}
              navigation={props.navigation}
              setSearchText={setSearchText}
              setUsers={setUsers}
              key={user._id}
            />
          ))}
        </ScrollView>
      </View>
    );
  }

  const handleSearch = debounce(async (nextValue) => {
    if (nextValue !== "") {
      const dataSearchUser = await axios
        .get(`${apiUrl}/search/${nextValue}`)
        .catch(() => {});
      if (dataSearchUser.data.success) {
        setUsers(dataSearchUser.data.users);
      } else {
        Alert.alert("Error!", "Error from server!");
      }
    }
  }, 1000);

  const onChangeSearchText = (text) => {
    setSearchText(text);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Input
          placeholder=" Search..."
          inputContainerStyle={{ borderWidth: 2, borderRadius: 10, height: 35 }}
          leftIcon={{ type: "antdesign", name: "search1" }}
          value={searchText}
          onChangeText={onChangeSearchText}
        />
      </View>
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8, width: SIZES.width },
});
