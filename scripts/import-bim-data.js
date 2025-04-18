// Add this helper function at the top
async function findOrCreate(endpoint, identifier, data) {
  try {
    const res = await axiosInstance.get(endpoint, {
      params: { [`filters[${identifier.field}]`]: identifier.value }
    });
    
    if (res.data.data.length > 0) {
      console.log(`Updating existing ${endpoint}: ${identifier.value}`);
      return await axiosInstance.put(`${endpoint}/${res.data.data[0].id}`, { data });
    }
    
    console.log(`Creating new ${endpoint}: ${identifier.value}`);
    return await axiosInstance.post(endpoint, { data });
  } catch (error) {
    console.error(`Error processing ${endpoint}:`, error.response?.data || error.message);
    return null;
  }
}

// Update the group creation in importGroups
// ... existing code ...
  for (const group of groupsData) {
    await findOrCreate('/groups', { field: 'GroupCategory', value: group.GroupCategory }, {
      GroupCategory: group.GroupCategory
    });
  }

// Update category group creation
// ... existing code ...
  for (const group of categoryGroupsData) {
    await findOrCreate('/category-groups', { field: 'GroupCategory', value: group.GroupCategory }, {
      KumpulanKategori: group.KumpulanKategori,
      GroupCategory: group.GroupCategory,
      Remark: group.Remark
    });
  }

// Update BIM entries creation
// In the BIM entries section, change Group to CategoryGroup
await findOrCreate('/alphabet-entries', { field: 'Word', value: entry.Word }, {
  /* ... entry data ... */
  CategoryGroup: categoryGroupId  // Changed from Group to CategoryGroup
});
  for (const entry of entriesData) {
    await findOrCreate('/alphabet-entries', { field: 'Word', value: entry.Word }, {
      /* ... entry data ... */
    });
  }