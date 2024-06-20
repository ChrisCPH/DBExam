USE [DatabaseExam]
GO

SET ANSI_PADDING ON
GO

/****** Object:  Index [NCI_ProductName]    Script Date: 17-06-2024 16:48:05 ******/
CREATE NONCLUSTERED INDEX [NCI_ProductName] ON [dbo].[Products]
(
	[ProductName] ASC
)
INCLUDE([ProductID],[Price],[DiscountedPrice],[DiscountPercentage],[ProductLink],[ImageLink],[CategoryID],[Rating],[RatingCount]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

