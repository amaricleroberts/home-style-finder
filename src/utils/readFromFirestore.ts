import { getDoc, doc, collection, DocumentReference, CollectionReference, getDocs, query, Query, WhereFilterOp, documentId} from "@firebase/firestore"
import { DocumentData, where, FieldPath } from "firebase/firestore";
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
  getCollectionByQueryingId: (path: string, operator: WhereFilterOp, operands: string[]): Promise<DocumentData> => {
    const queryDoc = collection(firestore, path);
    const q = query(queryDoc, where(documentId(), operator, operands));
    return getDocumentsFromQuery(q);
  }
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

function getDocumentsFromQuery(docRef: Query<DocumentData>): Promise<DocumentData> {
  return getDocs(docRef).catch((error) => {
    return Promise.reject(error);
  })
}

export default firestoreQueries;
