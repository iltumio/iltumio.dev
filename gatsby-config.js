module.exports = {
  siteMetadata: {
    title: "iltumio.dev",
    siteUrl: "https://iltumio.dev",
  },
  plugins: [
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-mdx",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    "@chakra-ui/gatsby-plugin",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-robots-txt",
  ],
};
