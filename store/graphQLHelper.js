export const getters = {
  joinGQLFiles: (state, getters) => (gqlFiles) => {
    if (gqlFiles.length < 2 && gqlFiles.length > 0) return gqlFiles[0]
    return getters.addFirstEnclosures(
      gqlFiles.reduce((prevFile, currFile) => {
        return (
          getters.removeFirstEnclosures(prevFile) +
          getters.removeFirstEnclosures(currFile)
        )
      })
    )
  },
  removeFirstEnclosures: () => (gqlString) => {
    return (' ' + gqlString)
      .slice(1)
      .replace('{', '')
      .replace(/}([^}]*)$/, '$1')
  },
  addFirstEnclosures: () => (gqlString) => {
    return `{${gqlString}}`
  },
}
