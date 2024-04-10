export const SearchedResult = (data , searchQuery) => {
    const searchedData = data.filter(element => {
        return element.username.includes(searchQuery);
    });
    return searchedData ; 
}