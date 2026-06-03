router.get("/user/:id", async (req, res) => {
  const data = await Orphan.find({ reportedBy: req.params.id });
  res.json(data);
});