"use client";
import Image from 'next/image'
import SearchComponent from '../components/SearchComponent';
import '../styles/chat-styles.css';

export default function Home() {
  return (
    <main className="flex flex-col items-center p-2 min-h-screen">
      <div className="w-full max-w-screen-md mx-auto flex justify-center items-center"> {/* Center align */}
        <a href="https://app.pinecone.io/organizations/-NF9xx-MFLRfp0AAuCon/projects/us-east4-gcp:bc4d5e7/indexes/product-catalog/browser" target="_blank">
          <img src="/pinecone-logo-black.png" alt="Semantic Search" className="h-24" />
        </a>
      </div>
      <div className="w-full max-w-screen-md mx-auto flex items-center">
        <div>
          <SearchComponent />
        </div>
      </div>
      <div className="w-full max-w-screen-md mx-auto flex justify-center items-center"> {/* Center align */}
        <p className='footer'>
          © Pinecone Systems, Inc. | San Francisco, CA <br />
          Pinecone is a registered trademark of Pinecone Systems, Inc.
        </p>
      </div>
    </main>
  );
}


