import { getDoc, doc, collection, DocumentReference, CollectionReference, getDocs, collectionGroup, query, Query} from "@firebase/firestore"
import { DocumentData } from "firebase/firestore";
import { firestore } from "./firebase"

const firestoreQueries = {
  getDocument: (path: string): Promise<DocumentData> => {
    const queryDoc = doc(firestore, path);
    return fetchDocument(queryDoc);
  },
  getCollection: (path: string): Promise<DocumentData> => {
    const queryDoc = collection(firestore, path);
    return getDocuments(queryDoc);
  },
};

function fetchDocument(docRef: DocumentReference): Promise<DocumentData> {
  return getDoc(docRef).catch((error) => {
    return Promise.reject(error);
  })
}

function getDocuments(docRef: CollectionReference): Promise<DocumentData> {
  return getDocs(docRef).catch((error) => {
    return Promise.reject(error);
  })
}

export default firestoreQueries;
