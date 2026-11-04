import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  TextInput,
} from "react-native";

import { BookCard } from "../components/BookCard";
import { colors } from "../theme";

const conditions=["New","Slightly Used","Used"];
const status=["Available","Lent","Current Read"];

const PAGE_PADDING = 18;
const GRID_GAP = 12;
const MAX_CONTENT_WIDTH = 560;

export function AddScreen({onAddListing}){
    const[title,setTitle]=useState("");
    const[author,setAuthor]=useState("");
    const[genre,setGenre]=useState("");
    const[condition,setCondition]=useState("");
    const[status,setStatus]=useState("");

    const handleAdd=()=>{
        const newListing={ 
        id:Date.now().toString(), 
        title:title.trim(), 
        author:author.trim(), 
        genre:genre.trim(),
        status:status.trim(),
        condition};
        
        if(onAddListing){
            onAddListing(newListing);
        }
        setTitle("");
        setAuthor("");
        setGenre("");
        setStatus("");
        setCondition("");
    };
    return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.screen}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.content}>
                <View style={styles.topBar}>
                  <Text style={styles.wordmark}>OUR/LIBRARY</Text>
                  <Text style={styles.calloutEyebrow}>New Listings</Text>
                </View>
                <View style={styles.intro}>
                  <Text style={styles.heading}>ADD A NEW BOOK TO OUR LIBRARY!</Text>
                  <Text style={styles.sub}>
                    Add a new book to share with our community
                  </Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.inputBar}>
                        <Text style={styles.inputLabel}>BOOK TITLE</Text>
                        <TextInput 
                        value={title} 
                        onChangeText={setTitle} 
                        placeholder="ex. Beloved" 
                        placeholderTextColor={colors.muted} 
                        style={styles.input}/>
                    </View>
                    <View style={styles.inputBar}>
                        <Text style={styles.inputLabel}>AUTHOR</Text>
                        <TextInput 
                        value={author} 
                        onChangeText={setAuthor} 
                        placeholder="ex. Toni Morrison " 
                        placeholderTextColor={colors.muted} 
                        style={styles.input}/>
                    </View>
                    <View style={styles.inputBar}>
                        <Text style={styles.inputLabel}>GENRE</Text>
                        <TextInput 
                        value={genre} 
                        onChangeText={setGenre} 
                        placeholder="ex. Fiction, Mystery, Sci-Fi" 
                        placeholderTextColor={colors.muted} 
                        style={styles.input}/>
                    </View>
                    <View style={styles.inputBar}>
                        <Text style={styles.inputLabel}>STATUS</Text>
                        <TextInput 
                        value={status} 
                        onChangeText={setStatus} 
                        placeholder="ex. Available, Current Read, Lent" 
                        placeholderTextColor={colors.muted} 
                        style={styles.input}/>
                    </View>

                    <View styles={styles.section}>
                        <Text styles={styles.sectionTitle}>Your Listing</Text>
                        <Text>
                            {title.trim()} <br/>{author.trim()}<br/>{genre.trim()}<br/>{status.trim()}
                        </Text>
                    </View>
                    <Pressable style={styles.button} 
                    onPress={handleAdd}>
                        <Text style={styles.buttonText}>Submit Book</Text>
                    </Pressable>
                </View>
                </View>
                
                  

            </ScrollView>
          </View>
        </SafeAreaView>
      );
    }
    

    const styles = StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: colors.paper,
        paddingTop: Platform.OS === "android" ? NativeStatusBar.currentHeight : 0,
      },
      screen: {
        flex: 1,
        backgroundColor: colors.canvas,
      },
      scrollContent: {
        paddingBottom: 16,
      },
      content: {
        width: "100%",
        maxWidth: MAX_CONTENT_WIDTH,
        alignSelf: "center",
        backgroundColor: colors.paper,
        paddingHorizontal: PAGE_PADDING,
      },
      topBar: {
        height: 62,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
      },
      wordmark: {
        color: colors.ink,
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: -0.6,
      },
      headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      },
      pressed: {
        opacity: 0.58,
      },
    
      actions: {
        flexDirection: "row",
        gap: 9,
        marginTop: 22,
      },
    
      callout: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.acid,
        marginTop: 18,
        paddingHorizontal: 14,
        paddingVertical: 13,
      },
    
      chevron: {
        color: colors.ink,
        fontSize: 26,
        fontWeight: "400",
      },
      section: {
        marginTop: 26,
      },
      sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      },
      sectionTitle: {
        color: colors.ink,
        fontSize: 11,
        fontWeight: "900",
        letterSpacing: 0.8,
      },
    
      emptyState: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colors.softMuted,
        paddingHorizontal: 14,
        paddingVertical: 16,
      },
      emptyText: {
        color: colors.muted,
        fontSize: 12,
        lineHeight: 18,
        textAlign: "center",
      },
    
      grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingTop: 18,
        rowGap: GRID_GAP,
      },
      intro: {
        paddingTop: 28,
        paddingBottom: 22,
      },
      heading: {
        color: colors.ink,
        fontSize: 28,
        lineHeight: 34,
        fontWeight: "900",
        letterSpacing: -0.8,
      },
      sub: {
        color: colors.muted,
      },
      clear: {
        color: colors.ink,
        fontSize: 22,
        fontWeight: "600",
        paddingHorizontal: 4,
      },
       inputBar: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.canvas,
    paddingHorizontal: 12,
    gap: 10,
  },
 
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 13,
    paddingVertical: 12,
  },
  button:{
        backgroundColor:colors.ink,
        marginTop:20,
        flexDirection:"row",
        alignItems:"center",
    },
    buttonText:{
        color:colors.softMuted,
        fontSize:12,
        fontWeight:"900",
    }
    });
    
    