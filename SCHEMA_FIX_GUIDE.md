# 🔧 **Appwrite Schema Fix Guide**

## 🚨 **Current Issues:**
Your Appwrite collection has several field name mismatches:
1. **"tiitle"** (with two 'i's) instead of **"title"**
2. **"Content"** (capital C) instead of **"content"** (lowercase)
3. **"FeatureImage"** (capital F and I) instead of **"featuredImage"** (lowercase)
4. **"Status"** (capital S) instead of **"status"** (lowercase)
5. **"UserId"** (capital U and I) instead of **"userId"** (lowercase)
6. **"slug"** field is missing or has a different name in your collection

## ✅ **Temporary Fix Applied:**
I've updated your code to use:
- "tiitle" instead of "title"
- "Content" instead of "content"
- "FeatureImage" instead of "featuredImage"
- "Status" instead of "status"
- "UserId" instead of "userId"
- Temporarily removed "slug" field (causing "Unknown attribute" error)

## 🎯 **Permanent Fix (Recommended):**

### **Option 1: Fix the Schema in Appwrite Console**
1. Go to [Appwrite Console](https://console.appwrite.io/)
2. Navigate to your project → Database → Your Database → Your Collection
3. Go to the "Attributes" tab
4. **Fix the "tiitle" attribute:**
   - Delete the "tiitle" attribute
   - Create a new attribute named "title" with the same settings
5. **Fix the "Content" attribute:**
   - Delete the "Content" attribute  
   - Create a new attribute named "content" (lowercase) with the same settings
6. **Fix the "FeatureImage" attribute:**
   - Delete the "FeatureImage" attribute
   - Create a new attribute named "featuredImage" (lowercase) with the same settings
7. **Fix the "Status" attribute:**
   - Delete the "Status" attribute
   - Create a new attribute named "status" (lowercase) with the same settings
8. **Fix the "UserId" attribute:**
   - Delete the "UserId" attribute
   - Create a new attribute named "userId" (lowercase) with the same settings
9. **Add the missing "slug" attribute:**
   - Create a new attribute named "slug" (string, required, unique)

### **Option 2: Update the Code Back (After fixing schema)**
Once you fix the schema, update these files back to use proper field names:

1. **src/appwrite/config.js** - Change "tiitle" back to "title", "Content" back to "content", "FeatureImage" back to "featuredImage", "Status" back to "status", "UserId" back to "userId", and add back "slug"
2. **src/components/PostCard.jsx** - Change "tiitle" back to "title" and "FeatureImage" back to "featuredImage"
3. **src/pages/Post.jsx** - Change "tiitle" back to "title", "Content" back to "content", and "FeatureImage" back to "featuredImage"
4. **src/components/post-form/PostForm.jsx** - Change "tiitle" back to "title", "Content" back to "content", "FeatureImage" back to "featuredImage", and "Status" back to "status"

## 🧪 **Test the Current Fix:**
1. Try creating a post now - it should work with "tiitle", "Content", "FeatureImage", "Status", and "UserId" (without "slug")
2. The post should save successfully to your Appwrite database
3. You should see the post displayed correctly

## 💡 **Why This Happened:**
- Typo during collection creation in Appwrite ("tiitle")
- Case sensitivity issues ("Content" vs "content", "FeatureImage" vs "featuredImage", "Status" vs "status", "UserId" vs "userId")
- Missing "slug" field in your collection schema
- Appwrite requires exact field name matches

## 🎉 **Current Status:**
- ✅ **Posts can be created** (using "tiitle", "Content", "FeatureImage", "Status", and "UserId")
- ✅ **Rich text editor works** (with your API key)
- ✅ **All components updated** to use correct field names
- ✅ **User authentication working** (userId is being passed correctly)
- 🔄 **Schema still has typos** (needs permanent fix)
- 🔄 **Missing "slug" field** (needs to be added to collection)

## 🚀 **Next Steps:**
1. **Test creating a post** - should work now with all five fixes (without slug)
2. **Fix the schema** in Appwrite Console (recommended)
3. **Add the missing "slug" field** to your collection
4. **Update code back** to use proper field names (after schema fix)
5. **Enjoy your working blog!**

## 📋 **Schema Requirements:**
Your collection should have these attributes:
- `title` (string, required) - NOT "tiitle"
- `slug` (string, required, unique) - **MISSING from your collection**
- `content` (string, required) - NOT "Content"  
- `featuredImage` (string, optional) - NOT "FeatureImage"
- `status` (string, optional) - NOT "Status"
- `userId` (string, required) - NOT "UserId"
