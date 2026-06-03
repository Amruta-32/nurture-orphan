router.get("/:userId", async (req, res) => {
  const alerts = await Alert.find({ userId: req.params.userId });
  res.json(alerts);
});