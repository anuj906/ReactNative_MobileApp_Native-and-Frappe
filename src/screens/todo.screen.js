import React, { useContext, useEffect, useState } from "react";
import { Layout, Input, Text, Card, Spinner } from "@ui-kitten/components";
import Toast from "react-native-toast-message";
import { FlashList } from "@shopify/flash-list";
import { useFrappe } from "../provider/backend";
import { Button, View } from "react-native";
import { AuthContext } from "../provider/auth";

const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, "");
};

export const TodoScreen = () => {
  const { db } = useFrappe();
  const [todos, setTodos] = useState([]);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [todo, setTodo] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const updateHandler = (item) => {
    setSelectedItem(item);
    setTodo(stripHtmlTags(item.description)); 
  };

  const saveUpdateHandler = async () => {
    if (selectedItem) {
      try {
        await db.updateDoc("ToDo", selectedItem.name, {
          description: todo,
        });
        fetchTodos();
        setSelectedItem(null);
        setTodo("");
        Toast.show({
          type: "success",
          position: "top",
          text1: "Success",
          text2: "Update action triggered",
        });
      } catch (error) {
        console.error("Error updating document:", error);
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "Failed to update the document",
        });
      }
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "No item selected for update",
      });
    }
  };

  const deleteHandler = async (item) => {
    try {
      await db.deleteDoc("ToDo", item);
      Toast.show({
        type: "success",
        position: "top",
        text1: "Success",
        text2: "Delete action triggered",
      });
      fetchTodos();
    } catch (error) {
      console.error("Error deleting document:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Failed to delete the document",
      });
    }
  };

  const fetchTodos = async () => {
    try {
      setLoadingTodos(true);
      const response = await db.getDocList("ToDo", {
        fields: ["name", "description"],
        orderBy: { field: "creation", order: "desc" },
      });
      setTodos(response);
    } catch (error) {
      console.error("Error fetching todos:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Failed to fetch todos",
      });
    } finally {
      setLoadingTodos(false);
    }
  };

  const TodoItem = ({ item }) => {
    const strippedDescription = stripHtmlTags(item.description);
    return (
      <Card key={item.name} style={{ marginBottom: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ flex: 1, marginRight: 10 }}>
            {strippedDescription}
          </Text>
          <Button
            title="Update"
            color="green"
            style={{ width: 80, marginRight: 10 }}
            onPress={() => updateHandler(item)}
          />
          <Button
            title="Delete"
            color="red"
            style={{ width: 80 }}
            onPress={() => deleteHandler(item.name)}
          />
        </View>
      </Card>
    );
  };

  return (
    <Layout
      style={{
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
      }}
    >
      <Input
        value={todo}
        onSubmitEditing={() => {
          if (selectedItem) {
            saveUpdateHandler();
          } else {
            db.createDoc("ToDo", { description: todo })
              .then(() => {
                setTodo("");
                fetchTodos();
                Toast.show({
                  type: "success",
                  position: "top",
                  text1: "Success",
                  text2: "Todo added successfully",
                });
              })
              .catch((error) => {
                console.error("Error creating document:", error);
                Toast.show({
                  type: "error",
                  position: "top",
                  text1: "Error",
                  text2: "Failed to add todo",
                });
              });
          }
        }}
        onChangeText={(nextValue) => setTodo(nextValue)}
        placeholder="What needs to be done?"
        style={{ marginBottom: 20 }}
      />

      {!loadingTodos && (
        <Layout style={{ width: "100%", height: "100%" }}>
          <FlashList
            data={todos}
            renderItem={TodoItem}
            estimatedItemSize={100}
            onRefresh={fetchTodos}
            refreshing={loadingTodos}
          />
        </Layout>
      )}

      {loadingTodos && (
        <Layout style={{ marginTop: 50 }}>
          <Spinner />
        </Layout>
      )}
    </Layout>
  );
};
